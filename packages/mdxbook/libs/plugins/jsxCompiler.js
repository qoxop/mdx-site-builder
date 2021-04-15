var babel = require("@babel/core");

module.exports = {
    condition: (vfile) => vfile.extname === '.jsx',
    runner: ({file, updateData, addFile, encoding}) => new Promise((rs) => {
        const codeStr = file.contents.toString();
        babel.transform(codeStr, {
            presets: ["@babel/preset-react"]
        },function(err, result) {
            if (!err) {
                file.contents = Buffer.from(result.code);
            }
            rs(file);
        });
    }),
}