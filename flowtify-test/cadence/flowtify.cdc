pub contract flowtify {
    pub var msg: String

    pub fun updateMsg(newMsg: String) {
        self.msg = newMsg
    }

    init() {
        self.msg = "Multi Auth example..."
    }
}