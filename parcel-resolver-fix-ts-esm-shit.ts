import {
    Resolver
} from "@parcel/plugin";
import path
    from "path";
import * as fs
    from "fs";
import {
    Dependency
} from "@parcel/types";

const extExp = /.jsx?$/;
const relativeExp = /^\./

export default new Resolver({
    async resolve({dependency, specifier}) {

        if (dependency.sourcePath && extExp.test(specifier) && relativeExp.test(specifier)) {
            const absoluteTsPath = buildTsPath(dependency, specifier);

            const checkerFuncs = [
                () => checkPathExists(absoluteTsPath),
                () => checkPathExists(absoluteTsPath + "x"),
            ]

            for (let checker of checkerFuncs) {
                const {exists, filePath} = await checker();

                if (exists) {
                    return {
                        filePath: filePath
                    }
                }
            }
        }
    }
})

function buildTsPath(dependency: Dependency, specifier: string) {
    const baseDir = (dependency.sourcePath || "").replace(/[\w-]+?\.[jt]sx?/, "");
    const relativeTsPath = specifier.replace(extExp, ".ts");
    return path.resolve(baseDir + relativeTsPath);
}

function checkPathExists(absoluteTsPath: string): Promise<{exists: boolean, filePath: string}> {
    return new Promise(resolve => {
        fs.stat(absoluteTsPath, {}, (err, stats) => {
            resolve({
                exists: Boolean(!err && stats.isFile()),
                filePath: absoluteTsPath,
            })
        });
    });
}