"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const password_1 = require("../Common/services/authentication/password");
const mongoose_service_1 = __importDefault(require("../Common/services/database/mongoose.service"));
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, requried: true },
    userType: { type: mongoose_1.Schema.Types.ObjectId, ref: "UserType" }
}, {
    toObject: {
        transform: function (doc, ret) { },
    },
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
        },
    },
});
UserSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashed = await password_1.Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
});
UserSchema.statics.build = (attrs) => {
    return new User(attrs);
};
const User = mongoose_service_1.default.getInstance().model("User", UserSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map