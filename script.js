import imageCompression from 'browser-image-compression';

async function handlePfpUpload(event) {
  const imageFile = event.target.files[0];
  
  // Impostazioni di compressione estreme ma perfette per le PFP
  const options = {
    maxSizeMB: 0.1, // Massimo 100KB!
    maxWidthOrHeight: 400, // Ridimensiona a 400x400px
    useWebWorker: true,
  };

  try {
    // 1. Comprimi l'immagine
    const compressedFile = await imageCompression(imageFile, options);
    
    // 2. Qui inserirai la logica Supabase per caricarla nel bucket "avatars"
    // const { data, error } = await supabase.storage.from('avatars').upload(...)
    
    console.log("Immagine compressa con successo:", compressedFile.size / 1024, "KB");
  } catch (error) {
    console.error("Errore di compressione:", error);
  }
}
