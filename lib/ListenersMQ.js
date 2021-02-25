exports.listenersManager =  async (payload) => {
    let {type,data} = payload
    if(type && data){
        switch (type) {
            case "msg":
                console.log("MSG: " ,data)
                break;
            case "msg1":
                console.log("MSG1: " ,data)
                break;
            default:
                console.log("XXX: " ,data)
        }
    }
}