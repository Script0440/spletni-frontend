export default function formatTime(timestamp: string | Date): string {
	const date = new Date(timestamp);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMinutes = Math.floor(diffMs / 60000);
 
	if (diffMinutes < 1) {
	  return 'Только что';
	}
 
	// Форматируем время в HH:mm
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${hours}:${minutes}`;
 }