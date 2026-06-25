function svgToPng(data, width, height, callback) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const img = new Image();

  const pixelDensity = 10;
  canvas.width = width * pixelDensity;
  canvas.height = height * pixelDensity;

  img.onload = function () {
    context.drawImage(img, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
    try {
      callback(canvas.toDataURL('image/png'));
    } catch (err) {
      console.warn('Error converting the workspace svg to a png: ' + err);
      callback('');
    }
  };

  img.src = data;
}

function workspaceToSvg(workspace, callback, customCss = '') {
  const textAreas = document.getElementsByTagName('textarea');
  for (let i = 0; i < textAreas.length; i += 1) {
    textAreas[i].innerHTML = textAreas[i].value;
  }

  const bBox = workspace.getBlocksBoundingBox();
  const x = bBox.x || bBox.left;
  const y = bBox.y || bBox.top;
  const width = bBox.width || bBox.right - x;
  const height = bBox.height || bBox.bottom - y;

  const blockCanvas = workspace.getCanvas();
  const clone = blockCanvas.cloneNode(true);
  clone.removeAttribute('transform');

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.appendChild(clone);
  svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
  svg.setAttribute(
    'class',
    'blocklySvg ' +
      (workspace.options.renderer || 'geras') +
      '-renderer ' +
      (workspace.getTheme ? workspace.getTheme().name + '-theme' : ''),
  );

  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.style.backgroundColor = 'transparent';

  const css = Array.from(document.head.querySelectorAll('style'))
    .filter((el) => /\.blocklySvg/.test(el.innerText) || el.id.startsWith('blockly-'))
    .map((el) => el.innerText)
    .join('\n');

  const style = document.createElement('style');
  style.innerHTML = css + '\n' + customCss;
  svg.insertBefore(style, svg.firstChild);

  let svgAsXML = new XMLSerializer().serializeToString(svg);
  svgAsXML = svgAsXML.replace(/&nbsp/g, '&#160');
  const data = 'data:image/svg+xml,' + encodeURIComponent(svgAsXML);

  svgToPng(data, width, height, callback);
}

export function downloadScreenshot(workspace) {
  workspaceToSvg(workspace, (datauri) => {
    const a = document.createElement('a');
    a.download = 'screenshot.png';
    a.target = '_self';
    a.href = datauri;
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
  });
}
