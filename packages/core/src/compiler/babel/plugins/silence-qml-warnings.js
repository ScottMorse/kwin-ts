/* eslint-disable */

module.exports = () => {
  return {
    visitor: {
      Function(path) {
        // This hoists all var declarations to the top of a function,
        // because QML will inevitably warn about using vars in lines before
        // they are assigned a value, but only within function bodies
        // and despite that the code isn't inherently invalid.
        // This avoids the transformed code from causing benign
        // but otherwise unavoidable warnings that occur naturally
        // due to the compilation process.
        for (const binding of Object.values(path.scope.bindings)) {
          if (binding.kind === "var") {
            binding.scope?.push?.({ id: binding.identifier });
          }
        }
      },
    },
  };
};
