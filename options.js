module.exports = options = (headless, start) => {
	const options = {
		headless: headless,
		autoRefresh: true,
		restartOnCrash: start,
		cacheEnabled: false,
		skipBrokenMethodsCheck: true,
		// executablePath: execPath,
		useChrome: true,
		killProcessOnBrowserClose: true,
		throwErrorOnTosBlock: false,
		chromiumArgs: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--aggressive-cache-discard',
			'--disable-cache',
			'--disable-application-cache',
			'--disable-offline-load-stale-cache',
			'--disk-cache-size=0'
		]
	}
	return options
}