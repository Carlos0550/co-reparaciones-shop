import pica from 'pica';

export const compressImage = async (imageFile) => {
    const img = new Image();
    const picaInstance = pica();

    const imageURL = URL.createObjectURL(imageFile);
    img.src = imageURL;

    return new Promise((resolve, reject) => {
        img.onload = async () => {
            const canvas = document.createElement('canvas');
            const width = img.width * 0.8;  
            const height = img.height * 0.8;

            canvas.width = width;
            canvas.height = height;

            try {
                await picaInstance.resize(img, canvas);
                const compressedBlob = await picaInstance.toBlob(canvas, 'image/webp', 0.8);  

                const compressedImage = new File([compressedBlob], imageFile.name.replace(/\.[^/.]+$/, "") + ".webp", {
                    type: 'image/webp',
                });

                resolve(compressedImage);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => reject(new Error("Error al cargar la imagen"));
    });
};