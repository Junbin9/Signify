import cv2
import numpy as np

# def apply_watermark(signature_path, watermark_path, signature_id):
def apply_watermark(signature_url, watermark_data):
    # # Apply watermark using OpenCV
    # signature_image = cv2.imread(signature_path)
    # watermark_image = cv2.imread(watermark_path, cv2.IMREAD_UNCHANGED)

    # Download the signature file
    signature_image = cv2.imdecode(np.frombuffer(signature_url, np.uint8), cv2.IMREAD_COLOR)
    watermark_image = cv2.imdecode(np.frombuffer(watermark_data, np.uint8), cv2.IMREAD_UNCHANGED)

    # Check if watermark has an alpha channel
    if watermark_image.shape[2] == 4:
        # Watermark has alpha channel
        (B, G, R, A) = cv2.split(watermark_image)
        B = cv2.bitwise_and(B, B, mask=A)
        G = cv2.bitwise_and(G, G, mask=A)
        R = cv2.bitwise_and(R, R, mask=A)
        watermark_image = cv2.merge([B, G, R, A])
    else:
        # Watermark does not have alpha channel
        (B, G, R) = cv2.split(watermark_image)
        A = np.ones(B.shape, dtype=B.dtype) * 255
        watermark_image = cv2.merge([B, G, R, A])

    # Resize watermark to fit within the specified region
    (h, w) = signature_image.shape[:2]
    (wH, wW) = watermark_image.shape[:2]

    # Calculate scaling factor
    scale_factor = min(h / float(wH), w / float(wW))
    new_width = int(wW * scale_factor)
    new_height = int(wH * scale_factor)

    # Resize watermark image
    watermark_image_resized = cv2.resize(watermark_image, (new_width, new_height), interpolation=cv2.INTER_AREA)

    # Ensure overlay has the same number of channels as the signature image
    if signature_image.shape[2] == 3:
        overlay = np.zeros((h, w, 4), dtype="uint8")
    else:
        overlay = np.zeros_like(signature_image)

    # Place watermark at the bottom-right corner
    overlay[h - new_height:h, w - new_width:w] = watermark_image_resized

    # Blend the images
    output = cv2.addWeighted(signature_image, 1.0, overlay[:, :, :3], 0.5, 0)

    # Save the result
    # output_path = f'watermarked_{signature_id}.png'
    output_path = f'watermarked_output.png'
    cv2.imwrite(output_path, output)

    return output_path
