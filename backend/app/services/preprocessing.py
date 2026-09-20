import os
import shutil


def preprocess_document_image(
    input_image_path: str,
    output_image_path: str
) -> dict:
    """
    Preprocesses uploaded land-record images for OCR.

    Uses OpenCV when available.
    Falls back to copying the original file if OpenCV
    cannot process the document.
    """

    # Make sure the output directory exists
    output_dir = os.path.dirname(output_image_path)

    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    cv2_success = False
    angle = 0.0

    try:
        import cv2
        import numpy as np

        # OpenCV requires an actual image file
        img = cv2.imread(input_image_path)

        if img is not None:

            h, w = img.shape[:2]

            # Convert to grayscale
            if len(img.shape) == 3:
                gray = cv2.cvtColor(
                    img,
                    cv2.COLOR_BGR2GRAY
                )
            else:
                gray = img.copy()

            # Noise reduction
            denoised = cv2.bilateralFilter(
                gray,
                d=9,
                sigmaColor=75,
                sigmaSpace=75
            )

            # Contrast enhancement
            clahe = cv2.createCLAHE(
                clipLimit=2.5,
                tileGridSize=(8, 8)
            )

            enhanced = clahe.apply(denoised)

            # Deskew detection
            coords = np.column_stack(
                np.where(enhanced < 200)
            )

            if len(coords) > 100:

                rect = cv2.minAreaRect(coords)

                ang = rect[-1]

                angle = (
                    -(90 + ang)
                    if ang < -45
                    else -ang
                )

                if (
                    abs(angle) > 0.5
                    and abs(angle) < 45
                ):

                    center = (
                        w // 2,
                        h // 2
                    )

                    matrix = cv2.getRotationMatrix2D(
                        center,
                        angle,
                        1.0
                    )

                    enhanced = cv2.warpAffine(
                        enhanced,
                        matrix,
                        (w, h),
                        flags=cv2.INTER_CUBIC,
                        borderMode=cv2.BORDER_REPLICATE
                    )

            # Binarization
            _, binarized = cv2.threshold(
                enhanced,
                0,
                255,
                cv2.THRESH_BINARY + cv2.THRESH_OTSU
            )

            # Save processed image
            cv2.imwrite(
                output_image_path,
                binarized
            )

            cv2_success = True

    except Exception:
        cv2_success = False

    # Fallback
    if not cv2_success:

        try:
            shutil.copyfile(
                input_image_path,
                output_image_path
            )

        except Exception:

            try:
                with open(
                    input_image_path,
                    "rb"
                ) as source:

                    data = source.read()

                with open(
                    output_image_path,
                    "wb"
                ) as destination:

                    destination.write(data)

            except Exception:
                pass

    return {
        "skew_angle_detected": (
            round(float(angle), 2)
            if angle != 0.0
            else 0.0
        ),
        "deskew_applied": cv2_success,
        "contrast_enhancement": (
            "CLAHE + Otsu Binarization"
            if cv2_success
            else "Fallback - Original Document"
        ),
        "noise_reduction": (
            "Bilateral Spatial Filter"
            if cv2_success
            else "Fallback - Original Document"
        ),
        "resolution": "Original document resolution",
        "processed_file": output_image_path
    }