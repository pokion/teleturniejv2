async function loadData(){
    try {
        const res = await fetch("/data");
        if(!res.ok)throw new Error('serwer zwrócił ' + res.status);
        const data = res.json();
        return data
    } catch(e){
        console.error('Błąd pobierania danych:', e);
    }
}

function fileToBase64(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result)); // z prefixem base64 żeby było bez prefixu trzeba potem tak .split(',')[1]
        reader.onerror = () => reject(new Error('Nie można odczytać pliku'));
        reader.readAsDataURL(file);
    });
}