var app = new Vue({
    el: '#app',
    data: {
	left: {},
	totp: '',
	info: '',
	countdown: null,
	powered: null,
	prealarm: new Audio('media/prealarm.ogg'),
	alarm: new Audio('media/alarm.ogg'),
	wrong: new Audio('media/fail.ogg'),
	timeout: new Audio('media/timeout.ogg'),
	push: new Audio('media/push.ogg'),
    },
    
    filters: {
	ledTime: function(str) {
	    if (str === null) return '--:--'
	    return str
	},
	formatTimeout: function (ts) {
	    if (typeof ts !== 'number') return null
	    if (ts < 0) return null
	    var min = Math.floor(ts / 60).toString()
	    var sec = Math.floor(ts % 60).toString()
	    if (min.length === 1) min = '0' + min;
	    if (sec.length === 1) sec = '0' + sec;
	    return min + ':' + sec;	
	},
    },

    mounted: function () {
	this.relayLeft()
	this.origTitle = document.title

	window.setInterval(() => {
            this.countdown = this.left.timeout - Date.now()/1000
	    this.powered = this.countdown >= 0
	    // Doing this hard way because vuejs doesn't like support titles
	    var newTitle = this.$options.filters.formatTimeout(this.countdown)
	    if (this.oldTitle !== newTitle) {
		if (this.countdown < 0) {
		    document.title = this.origTitle
		} else {
		    document.title = newTitle + ' – ' + this.origTitle
		}
		this.oldTitle = newTitle
	    }
	    
	    // Beep
	    if (this.countdown < 0) {
		if (this.alarm.loop || this.prealarm.loop) {
		    this.alarm.loop = false;
		    this.prealarm.loop = false;
		    this.timeout.play()
		}
	    } else if (this.countdown < 30) {
		if (!this.alarm.loop) {
		    this.prealarm.loop = false;
		    this.alarm.loop = true
		    this.alarm.play()
		}
	    } else if (this.countdown < 40) {
		if (!this.prealarm.loop) {
		    this.alarm.loop = false
		    this.prealarm.loop = true;
		    this.prealarm.play()
		}
	    } else {
		this.alarm.loop = false;
		this.prealarm.loop = false;
	    }
	},500)
    },

    methods: {
	relayLeft: function () {
	    var xhr = new XMLHttpRequest()
	    var self = this
	    xhr.open('GET', 'api/v1/left')
	    xhr.onload = function () {
		self.left = JSON.parse(xhr.responseText)
		self.hideInfoIfOk()
	    }
	    this.info = 'Ladataan alkutila...'
	    xhr.send()
	},

	relayOn: function () {
	    var xhr = new XMLHttpRequest()
	    var self = this
	    xhr.open('PUT', 'api/v1/on')
	    xhr.onload = function () {
		self.left = JSON.parse(xhr.responseText)
		self.hideInfoIfOk()
	    }
	    self.info = 'Kytketään sähköt päälle...'
	    xhr.send()
	},

	relayOff: function () {
	    var xhr = new XMLHttpRequest()
	    var self = this
	    xhr.open('PUT', 'api/v1/off')
	    xhr.onload = function () {
		self.left = JSON.parse(xhr.responseText)
		self.hideInfoIfOk()
	    }
	    this.info = 'Katkaistaan sähköt...'
	    if (window.confirm("Tämä katkaisee sähköt tulostimesta. Oletko varma?")) {
		xhr.send()
	    } else {
		this.left.error = "Peruutettu"
	    }
	},

	relayPush: function (code) {
	    var xhr = new XMLHttpRequest()
	    var self = this
	    xhr.open('PUT', 'api/v1/push?totp=' + encodeURIComponent(code))
	    xhr.onload = function () {
		self.left = JSON.parse(xhr.responseText)
		self.hideInfoIfOk()
		self.$refs.totp.focus()
		if (self.left.error) {
		    self.wrong.play()
		} else {
		    self.totp = ''
		    self.push.play()
		}
	    }
	    self.info = 'Pushing...'
	    xhr.send()
	},

	hideInfoIfOk: function () {
	    if (!this.left.error) this.info = 'Status OK'
	},
    }
})

