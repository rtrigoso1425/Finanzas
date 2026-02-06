'use client';;
import React from 'react';
import Cropper from 'react-easy-crop';
import { useDispatch } from 'react-redux';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setUser } from '@/features/auth/authSlice';
import { uploadProfileImageFeature } from '@/features/user/updateUserService';

export function AvatarUploader({
    children,
    onUpload,
    user,
    aspect = 1,
    maxSizeMB = 20,
    acceptedTypes = ['jpeg', 'jpg', 'png', 'webp']
}) {
	const [crop, setCrop] = React.useState({ x: 0, y: 0 });
	const [zoom, setZoom] = React.useState(1);

	const [isPending, setIsPending] = React.useState(false);
	const [error, setError] = React.useState(null);
	const [photo, setPhoto] = React.useState({
		url: '',
		file: null,
	});
	const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);

	const handleFileChange = (e) => {
		setError(null);
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const img_ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
			const validExt = acceptedTypes.includes(img_ext);

			if (!validExt) {
				setError(`Tipo de archivo no soportado. Solo se aceptan: ${acceptedTypes.join(', ')}`);
				return;
			}

			if (parseFloat(String(file.size)) / (1024 * 1024) >= maxSizeMB) {
				setError(`La imagen es demasiado grande. Máximo: ${maxSizeMB}MB`);
				return;
			}

			setPhoto({ url: URL.createObjectURL(file), file });
		} catch (err) {
			setError('Error al procesar la imagen. Por favor intenta de nuevo.');
		}
	};

	const handleCropComplete = (_, croppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels);
	};

	const [open, onOpenChange] = React.useState(false);
	const dispatch = useDispatch();

	const handleOpenChange = (newOpen) => {
		if (!newOpen) {
			setError(null);
			setPhoto({ url: '', file: null });
		}
		onOpenChange(newOpen);
	};

	const handleUpdate = async () => {
		if (photo?.file && croppedAreaPixels) {
			setIsPending(true);
			setError(null);
			try {
				const croppedImg = await getCroppedImg(photo?.url, croppedAreaPixels);
				if (!croppedImg || !croppedImg.file) {
					throw new Error('Failed to crop image');
				}

				const file = new File([croppedImg.file], photo.file?.name ?? 'cropped.jpeg', {
                    type: photo.file?.type ?? 'image/jpeg',
                });

				// Si user está disponible, usar la lógica de subida a BD
				if (user) {
					const newAvatarUrl = await uploadProfileImageFeature(file, user);
					
					// Actualizar Redux con la nueva URL
					dispatch(setUser({ ...user, avatar_url: newAvatarUrl }));
				} else if (onUpload) {
					// Si no hay user pero hay onUpload callback, usarlo
					await onUpload(file);
				} else {
					throw new Error('No upload method available');
				}

				setPhoto({ url: '', file: null });
				handleOpenChange(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al subir la imagen');
			} finally {
				setIsPending(false);
			}
		} else {
			setError('Por favor selecciona una imagen y ajústala antes de guardar');
		}
	};

	return (
        <Modal
            open={open}
            onOpenChange={handleOpenChange}
            drawerProps={{
				dismissible: photo?.file ? false : true,
			}}>
            <ModalTrigger asChild>{children}</ModalTrigger>
            <ModalContent className="h-max md:max-w-md">
				<ModalHeader>
					<ModalTitle>Subir Imagen</ModalTitle>
				</ModalHeader>
				<ModalBody className="space-y-2">
					<Input
                        disabled={isPending}
                        onChange={handleFileChange}
                        type="file"
                        accept="image/*" />
					{error && (
						<div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
							{error}
						</div>
					)}
					{photo?.file && (
						<div
                            className="bg-accent relative aspect-square w-full overflow-hidden rounded-lg">
							<Cropper
                                image={photo.url}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={handleCropComplete}
                                classes={{
									containerClassName: isPending
										? 'opacity-80 pointer-events-none'
										: '',
								}} />
						</div>
					)}
				</ModalBody>

				<ModalFooter className="grid w-full grid-cols-2">
					<Button
                        className="w-full"
                        variant="outline"
                        color="danger"
                        disabled={isPending}
                        onClick={() => handleOpenChange(false)}>
						Cancelar
					</Button>

					<Button
                        className="w-full"
                        type="button"
                        onClick={handleUpdate}
                        disabled={isPending || !photo?.file}>
						{isPending ? 'Subiendo...' : 'Guardar'}
					</Button>
				</ModalFooter>
			</ModalContent>
        </Modal>
    );
}

const createImage = url => new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
    image.src = url;
});

function getRadianAngle(degreeValue) {
	return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(width, height, rotation) {
	const rotRad = getRadianAngle(rotation);

	return {
		width:
			Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
		height:
			Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
	};
}

async function getCroppedImg(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
) {
	const image = await createImage(imageSrc);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		throw new Error('Failed to create 2D context');
	}

	const rotRad = getRadianAngle(rotation);

	// calculate bounding box of the rotated image
	const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

	// set canvas size to match the bounding box
	canvas.width = bBoxWidth;
	canvas.height = bBoxHeight;

	// translate canvas context to a central location to allow rotating and flipping around the center
	ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
	ctx.rotate(rotRad);
	ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
	ctx.translate(-image.width / 2, -image.height / 2);

	// draw rotated image
	ctx.drawImage(image, 0, 0);

	// extract cropped image
	const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

	// set canvas width to final desired crop size - this clears context
	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	// paste cropped image
	ctx.putImageData(data, 0, 0);

	// return blob + object URL
	return new Promise((resolve, reject) => {
		canvas.toBlob((file) => {
			if (!file) {
				reject(new Error('Failed to generate cropped image blob'));
				return;
			}
			resolve({
				url: URL.createObjectURL(file),
				file,
			});
		});
	});
}
