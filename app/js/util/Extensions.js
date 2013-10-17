// ie < 9 console log fix
if (!console) {
	function noop() {
	}
	console = {
		log: noop,
		warn:noop,
		trace: noop,
		error: noop
	}
}