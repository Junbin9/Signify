# # import cv2
# # import numpy as np
# # import pywt
# # import scipy.fftpack

# # # Function to apply 2D DCT
# # def dct2(block):
# #     return scipy.fftpack.dct(scipy.fftpack.dct(block.T, norm='ortho').T, norm='ortho')

# # # Function to apply inverse 2D DCT
# # def idct2(block):
# #     return scipy.fftpack.idct(scipy.fftpack.idct(block.T, norm='ortho').T, norm='ortho')

# # # Function to embed a robust watermark and data using DWT-DCT
# # # def embed_watermark_and_data(image, signature, data, scaling_factor=0.01):
# # #     try:
# # #         # Convert the data to binary
# # #         data_bin = ''.join([format(ord(char), '08b') for char in data])
# # #         data_idx = 0

# # #         # Resize the signature to match the image size
# # #         signature = cv2.resize(signature, (image.shape[1], image.shape[0]))

# # #         # Perform DWT
# # #         coeffs = pywt.dwt2(image, 'haar')
# # #         LL, (LH, HL, HH) = coeffs

# # #         # Apply DCT to the LL subband
# # #         dct_LL = dct2(LL)

# # #         # Embed the signature as a watermark in the DCT coefficients
# # #         for i in range(dct_LL.shape[0]):
# # #             for j in range(dct_LL.shape[1]):
# # #                 if signature[i, j] > 128:  # Threshold for embedding watermark
# # #                     dct_LL[i, j] += scaling_factor
# # #                 else:
# # #                     dct_LL[i, j] -= scaling_factor

# # #         # Embed the data in the modified DCT coefficients
# # #         for i in range(dct_LL.shape[0]):
# # #             for j in range(dct_LL.shape[1]):
# # #                 if data_idx >= len(data_bin):
# # #                     break
# # #                 bit = int(data_bin[data_idx])
# # #                 if bit == 1:
# # #                     dct_LL[i, j] += scaling_factor
# # #                 else:
# # #                     dct_LL[i, j] -= scaling_factor
# # #                 data_idx += 1

# # #         # Inverse DCT
# # #         LL_watermarked = idct2(dct_LL)

# # #         # Reconstruct the watermarked image using inverse DWT
# # #         watermarked_image = pywt.idwt2((LL_watermarked, (LH, HL, HH)), 'haar')
# # #         return np.clip(watermarked_image, 0, 255).astype(np.uint8), None
# # #     except Exception as e:
# # #         return None, f"Error embedding watermark and data: {str(e)}"

# # # # Function to extract watermark and data using DWT-DCT
# # # def extract_watermark_and_data(watermarked_image, original_image, scaling_factor=0.01, data_length=12):
# # #     try:
# # #         data_bin = ""

# # #         # Perform DWT on the watermarked and original images
# # #         coeffs_watermarked = pywt.dwt2(watermarked_image, 'haar')
# # #         LL_watermarked, (_, _, _) = coeffs_watermarked

# # #         # Apply DCT to the LL subband
# # #         dct_LL_watermarked = dct2(LL_watermarked)

# # #         # Extract data from DCT coefficients
# # #         for i in range(dct_LL_watermarked.shape[0]):
# # #             for j in range(dct_LL_watermarked.shape[1]):
# # #                 if len(data_bin) >= data_length * 8:
# # #                     break
# # #                 bit = 1 if dct_LL_watermarked[i, j] > 0 else 0
# # #                 data_bin += str(bit)

# # #         # Convert binary to string
# # #         extracted_data = ''.join([chr(int(data_bin[i:i+8], 2)) for i in range(0, len(data_bin), 8)])
# # #         return extracted_data, None
# # #     except Exception as e:
# # #         return None, f"Error extracting watermark and data: {str(e)}"

# # # def extract_watermark_and_data(watermarked_image, scaling_factor=0.01):
# # #     try:
# # #         # Perform DWT to decompose the watermarked image
# # #         coeffs = pywt.dwt2(watermarked_image, 'haar')
# # #         LL, (LH, HL, HH) = coeffs

# # #         # Apply DCT to the LL subband
# # #         dct_LL = dct2(LL)

# # #         # Extract the watermark image
# # #         extracted_signature = np.zeros_like(LL)
# # #         for i in range(dct_LL.shape[0]):
# # #             for j in range(dct_LL.shape[1]):
# # #                 if dct_LL[i, j] > 0:
# # #                     extracted_signature[i, j] = 255
# # #                 else:
# # #                     extracted_signature[i, j] = 0

# # #         # Reconstruct the watermark image
# # #         extracted_signature = np.clip(extracted_signature, 0, 255).astype(np.uint8)

# # #         # Extract the embedded data
# # #         data_bin = ""
# # #         for i in range(dct_LL.shape[0]):
# # #             for j in range(dct_LL.shape[1]):
# # #                 if dct_LL[i, j] > 0:
# # #                     data_bin += "1"
# # #                 else:
# # #                     data_bin += "0"

# # #         # Convert binary data to string
# # #         extracted_data = ""
# # #         for i in range(0, len(data_bin), 8):
# # #             byte = data_bin[i:i + 8]
# # #             if len(byte) < 8:
# # #                 break
# # #             extracted_data += chr(int(byte, 2))

# # #         return extracted_signature, extracted_data.strip(), None
# # #     except Exception as e:
# # #         return None, None, f"Error extracting watermark and data: {str(e)}"

# # # Function to embed a watermark image and text
# # def embed_watermark_and_data(image, watermark_image, text, scaling_factor=0.01):
# #     try:
# #         # Convert text to binary
# #         text_bin = ''.join([format(ord(char), '08b') for char in text])
# #         text_idx = 0

# #         # Resize the watermark image to match the image's LL subband size
# #         coeffs = pywt.dwt2(image, 'haar')
# #         LL, (LH, HL, HH) = coeffs
# #         watermark_resized = cv2.resize(watermark_image, (LL.shape[1], LL.shape[0]))

# #         # Apply DCT to the LL subband
# #         dct_LL = dct2(LL)

# #         # Embed the watermark image in the low-frequency coefficients of LL
# #         for i in range(dct_LL.shape[0]):
# #             for j in range(dct_LL.shape[1]):
# #                 if watermark_resized[i, j] > 128:  # Threshold for embedding
# #                     dct_LL[i, j] += scaling_factor
# #                 else:
# #                     dct_LL[i, j] -= scaling_factor

# #         # Apply DCT to the HH subband for embedding text
# #         dct_HH = dct2(HH)

# #         # Embed the text binary data in the high-frequency coefficients of HH
# #         for i in range(dct_HH.shape[0]):
# #             for j in range(dct_HH.shape[1]):
# #                 if text_idx >= len(text_bin):
# #                     break
# #                 bit = int(text_bin[text_idx])
# #                 if bit == 1:
# #                     dct_HH[i, j] += scaling_factor
# #                 else:
# #                     dct_HH[i, j] -= scaling_factor
# #                 text_idx += 1

# #         # Inverse DCT
# #         LL_watermarked = idct2(dct_LL)
# #         HH_watermarked = idct2(dct_HH)

# #         # Reconstruct the watermarked image using inverse DWT
# #         watermarked_image = pywt.idwt2((LL_watermarked, (LH, HL, HH_watermarked)), 'haar')
# #         return np.clip(watermarked_image, 0, 255).astype(np.uint8), None
# #     except Exception as e:
# #         return None, f"Error embedding watermark and data: {str(e)}"

# # # Function to extract watermark image and text
# # def extract_watermark_and_data(watermarked_image, scaling_factor=0.01):
# #     try:
# #         # Perform DWT to decompose the watermarked image
# #         coeffs = pywt.dwt2(watermarked_image, 'haar')
# #         LL, (LH, HL, HH) = coeffs

# #         # Apply DCT to the LL subband
# #         dct_LL = dct2(LL)

# #         # Extract the watermark image from LL
# #         extracted_watermark = np.zeros_like(LL)
# #         for i in range(dct_LL.shape[0]):
# #             for j in range(dct_LL.shape[1]):
# #                 if dct_LL[i, j] > 0:
# #                     extracted_watermark[i, j] = 255
# #                 else:
# #                     extracted_watermark[i, j] = 0

# #         # Apply DCT to the HH subband for text extraction
# #         dct_HH = dct2(HH)

# #         # Extract binary data from HH
# #         text_bin = ""
# #         for i in range(dct_HH.shape[0]):
# #             for j in range(dct_HH.shape[1]):
# #                 if dct_HH[i, j] > 0:
# #                     text_bin += "1"
# #                 else:
# #                     text_bin += "0"

# #         # Convert binary data to string
# #         extracted_text = ""
# #         for i in range(0, len(text_bin), 8):
# #             byte = text_bin[i:i + 8]
# #             if len(byte) < 8:
# #                 break
# #             extracted_text += chr(int(byte, 2))

# #         return np.clip(extracted_watermark, 0, 255).astype(np.uint8), extracted_text.strip(), None
# #     except Exception as e:
# #         return None, None, f"Error extracting watermark and data: {str(e)}"

# # # def embed_watermark_and_data(image, signature, data, scaling_factor=0.01):
# # #     try:
# # #         # Convert the data to binary
# # #         data_bin = ''.join([format(ord(char), '08b') for char in data])
# # #         data_idx = 0
        
# # #         # Resize the signature to match the image size
# # #         signature = cv2.resize(signature, (image.shape[1], image.shape[0]))
        
# # #         # Perform DWT
# # #         coeffs = pywt.dwt2(image, 'haar')
# # #         LL, (LH, HL, HH) = coeffs
        
# # #         # Apply DCT to the LL subband
# # #         dct_LL = dct2(LL)
        
# # #         # Create separate regions for watermark and data
# # #         mid_row = dct_LL.shape[0] // 2
        
# # #         # Embed the signature as a watermark in the top half
# # #         for i in range(mid_row):
# # #             for j in range(dct_LL.shape[1]):
# # #                 if signature[i, j] > 128:
# # #                     dct_LL[i, j] = abs(dct_LL[i, j]) + scaling_factor
# # #                 else:
# # #                     dct_LL[i, j] = -abs(dct_LL[i, j]) - scaling_factor
        
# # #         # Embed the data in the bottom half
# # #         for i in range(mid_row, dct_LL.shape[0]):
# # #             for j in range(dct_LL.shape[1]):
# # #                 if data_idx >= len(data_bin):
# # #                     break
# # #                 bit = int(data_bin[data_idx])
# # #                 if bit == 1:
# # #                     dct_LL[i, j] = abs(dct_LL[i, j]) + scaling_factor
# # #                 else:
# # #                     dct_LL[i, j] = -abs(dct_LL[i, j]) - scaling_factor
# # #                 data_idx += 1
        
# # #         # Inverse DCT
# # #         LL_watermarked = idct2(dct_LL)
        
# # #         # Reconstruct the watermarked image using inverse DWT
# # #         watermarked_image = pywt.idwt2((LL_watermarked, (LH, HL, HH)), 'haar')
# # #         return np.clip(watermarked_image, 0, 255).astype(np.uint8), None
    
# # #     except Exception as e:
# # #         return None, f"Error embedding watermark and data: {str(e)}"

# # # def extract_watermark_and_data(watermarked_image, scaling_factor=0.01):
# # #     try:
# # #         # Perform DWT to decompose the watermarked image
# # #         coeffs = pywt.dwt2(watermarked_image, 'haar')
# # #         LL, (LH, HL, HH) = coeffs
        
# # #         # Apply DCT to the LL subband
# # #         dct_LL = dct2(LL)
        
# # #         mid_row = dct_LL.shape[0] // 2
        
# # #         # Extract the watermark image from top half
# # #         extracted_signature = np.zeros((dct_LL.shape[0], dct_LL.shape[1]), dtype=np.uint8)
# # #         for i in range(mid_row):
# # #             for j in range(dct_LL.shape[1]):
# # #                 if dct_LL[i, j] > 0:
# # #                     extracted_signature[i, j] = 255
# # #                 else:
# # #                     extracted_signature[i, j] = 0
        
# # #         # Extract the embedded data from bottom half
# # #         data_bin = ""
# # #         for i in range(mid_row, dct_LL.shape[0]):
# # #             for j in range(dct_LL.shape[1]):
# # #                 if dct_LL[i, j] > 0:
# # #                     data_bin += "1"
# # #                 else:
# # #                     data_bin += "0"
        
# # #         # Convert binary data to string
# # #         extracted_data = ""
# # #         for i in range(0, len(data_bin), 8):
# # #             byte = data_bin[i:i + 8]
# # #             if len(byte) < 8:
# # #                 break
# # #             try:
# # #                 extracted_data += chr(int(byte, 2))
# # #             except ValueError:
# # #                 break
        
# # #         # Resize extracted signature back to original shape
# # #         # extracted_signature = cv2.resize(extracted_signature, (original_shape[1], original_shape[0]))
        
# # #         return extracted_signature, extracted_data.strip(), None
    
# # #     except Exception as e:
# # #         return None, None, f"Error extracting watermark and data: {str(e)}"

# import cv2
# import numpy as np
# import pywt

# # Function to embed a watermark image and text using DWT and robust embedding
# def embed_watermark_and_data(image, watermark_image, text, scaling_factor=0.01):
#     try:
#         # Perform DWT
#         coeffs = pywt.dwt2(image, 'haar')
#         LL, (LH, HL, HH) = coeffs

#         # Debug: Save initial DWT subbands
#         cv2.imwrite('LL_before_embedding.jpg', LL)
#         cv2.imwrite('HH_before_embedding.jpg', HH)

#         # Embed watermark in LL
#         watermark_resized = cv2.resize(watermark_image, (LL.shape[1], LL.shape[0]))
#         for i in range(watermark_resized.shape[0]):
#             for j in range(watermark_resized.shape[1]):
#                 LL[i, j] += scaling_factor if watermark_resized[i, j] > 128 else -scaling_factor

#         # Debug: Save LL after embedding watermark
#         cv2.imwrite('LL_after_embedding.jpg', LL)

#         # Embed text in HH
#         text_bin = ''.join([format(ord(char), '08b') for char in text])
#         print("Original Text:", text)
#         print("Binary Representation:", text_bin)

#         HH_flat = HH.flatten()
#         for idx, bit in enumerate(text_bin):
#             if idx >= len(HH_flat):
#                 break
#             HH_flat[idx] += scaling_factor if int(bit) == 1 else -scaling_factor

#         HH = HH_flat.reshape(HH.shape)

#         # Debug: Save HH after embedding text
#         cv2.imwrite('HH_after_embedding.jpg', HH)
#         print("HH coefficients after embedding:", HH_flat[:len(text_bin)])

#         # Reconstruct watermarked image
#         watermarked_image = pywt.idwt2((LL, (LH, HL, HH)), 'haar')

#         # Debug: Save reconstructed image
#         cv2.imwrite('reconstructed_image.jpg', watermarked_image)

#         return np.clip(watermarked_image, 0, 255).astype(np.uint8), None
#     except Exception as e:
#         return None, f"Error embedding watermark and data: {str(e)}"

# # Function to extract watermark image and text using DWT
# def extract_watermark_and_data(watermarked_image, scaling_factor=0.01):
#     try:
#         # Perform DWT to decompose the watermarked image
#         coeffs = pywt.dwt2(watermarked_image, 'haar')
#         LL, (LH, HL, HH) = coeffs

#         # Debug: Save DWT subbands
#         cv2.imwrite('LL_after_dwt.jpg', LL)
#         cv2.imwrite('HH_after_dwt.jpg', HH)

#         # Apply DCT to the LL subband
#         dct_LL = dct2(LL)

#         # Extract the watermark image from LL
#         extracted_watermark = np.zeros_like(LL)
#         for i in range(dct_LL.shape[0]):
#             for j in range(dct_LL.shape[1]):
#                 if dct_LL[i, j] > 0:
#                     extracted_watermark[i, j] = 255
#                 else:
#                     extracted_watermark[i, j] = 0

#         # Debug: Save extracted watermark
#         cv2.imwrite('extracted_watermark.jpg', extracted_watermark)

#         # Apply DCT to the HH subband for text extraction
#         dct_HH = dct2(HH)

#         # Extract binary data from HH
#         text_bin = ""
#         for i in range(dct_HH.shape[0]):
#             for j in range(dct_HH.shape[1]):
#                 if dct_HH[i, j] > 0:
#                     text_bin += "1"
#                 else:
#                     text_bin += "0"

#         # Debug: Print extracted binary text
#         print("Extracted Binary Data:", text_bin)

#         # Convert binary data to string
#         extracted_text = ""
#         for i in range(0, len(text_bin), 8):
#             byte = text_bin[i:i + 8]
#             if len(byte) < 8:
#                 break
#             extracted_text += chr(int(byte, 2))

#         print("Extracted Text:", extracted_text.strip())

#         # Debug: Validate extracted results
#         if extracted_watermark is not None:
#             cv2.imwrite('validated_extracted_watermark.jpg', extracted_watermark)

#         if extracted_text:
#             print("Validated Extracted Text:", extracted_text.strip())

#         return np.clip(extracted_watermark, 0, 255).astype(np.uint8), extracted_text.strip(), None
#     except Exception as e:
#         return None, None, f"Error extracting watermark and data: {str(e)}"
