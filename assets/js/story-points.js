const h = { closed: 0, open: 0 }
let disableObserver = false;

const columns = document.querySelectorAll('.js-project-column');

const accumulatePoint = (link, point) => {
  const previousElement = link.previousElementSibling;
  const isClosed = previousElement.querySelector('.octicon-issue-closed');

  if (isClosed === null) {
    h.open = h.open + point;
  } else {
    h.closed = h.closed + point;
  }
}

const getPoint = (links) => (
  Array.from(links).map(link => {
    const match = link.innerText.match(/\[(\d+)pt\]/);
    if (match) {
      const point = parseInt(match[1]);
      accumulatePoint(link, point);
      return point;
    }
  })
  .filter(n => Number.isInteger(n))
  .reduce((a, b) => a + b, 0)
);

const showTotalPoint = () => {
  const counter = document.querySelector('.js-column-card-count');
  let pointNode = counter.cloneNode(false);
  const label = `${h.closed}pt / ${h.open + h.closed}pt`;
  pointNode.innerText = label;
  pointNode.removeAttribute('aria-label');
  const menu = document.querySelector('.js-updatable-content .js-show-project-menu');
  menu.insertAdjacentHTML('beforebegin', pointNode.outerHTML);
};

const callback = () => {
  if (!!disableObserver) return;
  disableObserver = true;

  setTimeout(() => {
    columns.forEach(column => {
      const links = column.querySelectorAll('.js-project-card-issue-link');
      const point = getPoint(links);

      if (point !== 0) {
        const counter = column.querySelector('.js-column-card-count');
        let pointNode = counter.cloneNode(false);
        const label = `${point}pt`;
        pointNode.innerText = label;
        pointNode.setAttribute('aria-label', label);
        counter.insertAdjacentHTML('afterend', pointNode.outerHTML);
      }
    });

    showTotalPoint();
  }, 500);
}

const observer = new MutationObserver(callback);

const options = {
  attributes: true,
  subtree: true,
};

observer.observe(columns[columns.length - 1], options);
