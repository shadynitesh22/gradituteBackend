
import MongoseService from "../database/mongoose.service";
import {DbPopulate}  from "../database/populate";

async function initAndFill() {
    await MongoseService.connectWithRetry();
    await DbPopulate();
}

export default initAndFill;