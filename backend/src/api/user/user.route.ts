import z, { ZodError } from "zod";
import { Router } from "express";
import { getUserSettings, getUserProfileSettings, getUserSettingsForSettingsContext, setUserSettings, getPfp } from "./user.services.js";
import bodyParser from "body-parser";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import multer from "multer";
import _ from "lodash";
import { serverConfig } from "../../configs/secrets.js";
import { tmpDir } from "../../utils/tmpDir.js";
import { Jimp } from "jimp";

export const userRouter = Router();

userRouter.get("/get-user-settings", authenticateToken, async (req, res) => {
    try {
        const values = await getUserSettings(res.locals.user.id);
        res.json({ status:"success", settings:values });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "failed",
            message: (error as Error).message,
        });
    }
});

userRouter.get("/get-user-settings-for-settings-context", authenticateToken, async (req, res) => {
    try {
        const values = await getUserSettingsForSettingsContext(res.locals.user.id);
        res.json({ status:"success", settings:values });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "failed",
            message: (error as Error).message,
        });
    }
});

userRouter.get("/get-user-profile-settings/:userId", async (req, res) => {
    try {
        const user_id = parseInt(req.params.userId);
        const values = await getUserProfileSettings(user_id);
        res.json({ status:"success", settings:values });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "failed",
            message: (error as Error).message,
        });
    }
});

const setSettingsSchema = z.object({
    settings: z.map(z.string(),z.string()),
});

userRouter.post("/set-user-settings", authenticateToken, bodyParser.text(), async (req, res) => {
    try {
        let body = JSON.parse(req.body, (key, value) => {
            if(typeof value === 'object' && value !== null) {
                if (value.dataType === 'Map') {
                    return new Map(value.value);
                }
            }
            return value;
        });
        body = setSettingsSchema.parse(body);
        await setUserSettings(res.locals.user.id, body.settings);
        res.json({ status:"success" });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "failed",
            message: error instanceof ZodError ? "Invalid body" : (error as Error).message,
        });
    }
});

userRouter.get("/pfp/:userId", async (req, res) => {
    try {
        const blob:string = await getPfp(Number(req.params.userId));
        res.set({
            'content-type': 'image/jpeg',
            'content-length': blob.length,
        })
        res.send(blob);
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "failed",
            message: (error as Error).message,
        });
    }
});

const uploadPfp = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, tmpDir.name);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix);
        },
    }),
    fileFilter: function(req, file, cb) {
        var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/webp', 'image/png'];
        
        if (_.includes(allowedMimes, file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only jpg, png and webp image files are allowed.'));
        }
    },
    limits: {
        files: 1,
        fileSize: 1024 * 1024,
    },
})

// todo: figure out authentication 
userRouter.post("/set-pfp", uploadPfp.single('pfp'), async(req, res) => {
    try {
        console.log(req.file);
        if (req.file) {
            const image = await Jimp.read(req.file.path);
            const writeDestination = req.file.destination + '\\' + req.file.filename;
            image.resize({w:256,h:256});
            await image.write(`${writeDestination}.jpeg`, {quality:0.8});
        }
        
        res.redirect(serverConfig.FRONTEND_URL+"/settings");
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "failed",
            message: (error as Error).message,
        });
    }
});