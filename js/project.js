const ProjectManager = (() => {
  let files = [];

  function load(fileList) {
    files = Array.from(fileList).map(file => ({
      name: file.name,
      path: file.webkitRelativePath || file.name,
      file
    })).sort((a, b) => a.path.localeCompare(b.path));

    return files;
  }

  function getFiles() {
    return [...files];
  }

  function getSummary() {
    return {
      count: files.length,
      paths: files.map(f => f.path),
      hasHtml: files.some(f => f.name.toLowerCase().endsWith(".html")),
      hasCss: files.some(f => f.name.toLowerCase().endsWith(".css")),
      hasJs: files.some(f => f.name.toLowerCase().endsWith(".js"))
    };
  }

  return { load, getFiles, getSummary };
})();
