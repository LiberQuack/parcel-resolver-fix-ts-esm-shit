"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("@parcel/plugin");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const extExp = /.jsx?$/;
const relativeExp = /^\./;
exports.default = new plugin_1.Resolver({
    async resolve({ dependency, specifier }) {
        if (dependency.sourcePath && extExp.test(specifier) && relativeExp.test(specifier)) {
            const absoluteTsPath = buildTsPath(dependency, specifier);
            const checkerFuncs = [
                () => checkPathExists(absoluteTsPath),
                () => checkPathExists(absoluteTsPath + "x"),
            ];
            for (let checker of checkerFuncs) {
                const { exists, filePath } = await checker();
                if (exists) {
                    return {
                        filePath: filePath
                    };
                }
            }
        }
    }
});
function buildTsPath(dependency, specifier) {
    const baseDir = (dependency.sourcePath || "").replace(/[\w-]+?\.[jt]sx?/, "");
    const relativeTsPath = specifier.replace(extExp, ".ts");
    return path_1.default.resolve(baseDir + relativeTsPath);
}
function checkPathExists(absoluteTsPath) {
    return new Promise(resolve => {
        fs.stat(absoluteTsPath, {}, (err, stats) => {
            resolve({
                exists: Boolean(!err && stats.isFile()),
                filePath: absoluteTsPath,
            });
        });
    });
}
