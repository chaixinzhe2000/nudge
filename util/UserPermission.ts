import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'

const getCameraPermission = async () => {
    if (!Constants.platform) {
        return;
    }
    if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert("We need permission before we move on")
        }
    }
}


export default getCameraPermission;