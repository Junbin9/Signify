import cv2
import numpy as np
import pywt
import scipy.fftpack
from cryptography.fernet import Fernet

# Function to apply 2D DCT
def dct2(block):
    return scipy.fftpack.dct(scipy.fftpack.dct(block.T, norm='ortho').T, norm='ortho')

# Function to apply inverse 2D DCT
def idct2(block):
    return scipy.fftpack.idct(scipy.fftpack.idct(block.T, norm='ortho').T, norm='ortho')

# Generate encryption key
encryption_key = Fernet.generate_key()
cipher = Fernet(encryption_key)

# Embedding function
def embed_watermark_and_data(image, watermark_image, text, scaling_factor=0.01):
    try:
        # Encrypt the text for secure embedding
        encrypted_text = cipher.encrypt(text.encode()).decode()
        
        # Convert encrypted text to binary
        text_bin = ''.join(format(ord(char), '08b') for char in encrypted_text)
        text_idx = 0

        with open('binary_data.txt', 'w') as f:
            f.write(text_bin)

        # Perform DWT on the cover image
        coeffs = pywt.dwt2(image, 'haar')
        LL, (LH, HL, HH) = coeffs

        # Debug: Save DWT subbands
        cv2.imwrite('LL_before_embedding.jpg', LL)
        cv2.imwrite('HH_before_embedding.jpg', HH)

        # Resize watermark to fit LL subband
        watermark_resized = cv2.resize(watermark_image, (LL.shape[1], LL.shape[0]))

        # Apply DCT to LL and HH
        dct_LL = dct2(LL)
        dct_HH = dct2(HH)

        # Embed watermark into LL's low-frequency coefficients
        for i in range(dct_LL.shape[0]):
            for j in range(dct_LL.shape[1]):
                if watermark_resized[i, j] > 128:  # Threshold for watermark embedding
                    dct_LL[i, j] += scaling_factor
                else:
                    dct_LL[i, j] -= scaling_factor

        # Embed encrypted text into HH's high-frequency coefficients
        for i in range(dct_HH.shape[0]):
            for j in range(dct_HH.shape[1]):
                if text_idx >= len(text_bin):
                    break
                bit = int(text_bin[text_idx])
                if bit == 1:
                    dct_HH[i, j] += scaling_factor
                else:
                    dct_HH[i, j] -= scaling_factor
                text_idx += 1

        # Debug: Save modified DCT coefficients
        np.savetxt('dct_LL_after_embedding.txt', dct_LL)
        np.savetxt('dct_HH_after_embedding.txt', dct_HH)

        # Apply inverse DCT
        LL_watermarked = idct2(dct_LL)
        HH_watermarked = idct2(dct_HH)

        # Reconstruct the watermarked image using inverse DWT
        watermarked_image = pywt.idwt2((LL_watermarked, (LH, HL, HH_watermarked)), 'haar')

        # Debug: Save reconstructed image
        cv2.imwrite('reconstructed_image.jpg', watermarked_image)

        return np.clip(watermarked_image, 0, 255).astype(np.uint8), None
    except Exception as e:
        return None, f"Error embedding watermark and data: {str(e)}"

def extract_watermark_and_data(watermarked_image, scaling_factor=0.01):
    try:
        # Perform DWT on the watermarked image
        coeffs = pywt.dwt2(watermarked_image, 'haar')
        LL, (LH, HL, HH) = coeffs

        # Debug: Save extracted DWT subbands
        cv2.imwrite('LL_extracted.jpg', LL)
        cv2.imwrite('HH_extracted.jpg', HH)

        # Apply DCT to LL and HH
        dct_LL = dct2(LL)
        dct_HH = dct2(HH)

        # Debug: Save extracted DCT coefficients
        np.savetxt('dct_LL_extracted.txt', dct_LL)
        np.savetxt('dct_HH_extracted.txt', dct_HH)

        # Extract watermark from LL
        extracted_watermark = np.zeros_like(dct_LL)
        for i in range(dct_LL.shape[0]):
            for j in range(dct_LL.shape[1]):
                if dct_LL[i, j] > 0:
                    extracted_watermark[i, j] = 255
                else:
                    extracted_watermark[i, j] = 0

        # Extract binary text from HH
        text_bin = ""
        for i in range(dct_HH.shape[0]):
            for j in range(dct_HH.shape[1]):
                if dct_HH[i, j] > 0:
                    text_bin += "1"
                else:
                    text_bin += "0"

        # Debug: Save extracted binary text
        with open('extracted_binary_data.txt', 'w') as f:
            f.write(text_bin)

        # Convert binary to encrypted text
        encrypted_text = ""
        for i in range(0, len(text_bin), 8):
            byte = text_bin[i:i + 8]
            if len(byte) < 8:
                break
            encrypted_text += chr(int(byte, 2))

        # Debug: Print reconstructed encrypted text
        print(f"Reconstructed Encrypted Text: {encrypted_text}")

        # Validate encryption and decryption key consistency
        print(f"Encryption Key Used: {cipher._signing_key}")  # Debugging only; avoid exposing keys in production

        # Test decryption process
        try:
            extracted_text = cipher.decrypt(encrypted_text.encode()).decode()
        except Exception as e:
            print(f"Decryption failed: {str(e)}")
            cv2.imwrite('extracted_watermark.jpg', np.clip(extracted_watermark, 0, 255).astype(np.uint8))
            return extracted_watermark, None, f"Decryption error: {str(e)}"

        # Debug: Save extracted watermark image
        cv2.imwrite('extracted_watermark.jpg', extracted_watermark)

        return np.clip(extracted_watermark, 0, 255).astype(np.uint8), extracted_text.strip(), None
    except Exception as e:
        return None, None, f"Error extracting watermark and data: {str(e)}"
