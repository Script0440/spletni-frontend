export async function getTLDs() {
	const res = await fetch('https://data.iana.org/TLD/tlds-alpha-by-domain.txt');
	const text = await res.text();
	const tlds = text
	  .split('\n')
	  .filter((line) => line && !line.startsWith('#'))
	  .map((line) => '.' + line.toLowerCase());
 
	console.log(tlds); // список всех .com, .ru, .dev и т.д.
 }