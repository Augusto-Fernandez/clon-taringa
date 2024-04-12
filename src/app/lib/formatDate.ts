export default function formatDate(dateString: Date): string {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    
    return `${time} ${day}-${month}-${year}`;
}