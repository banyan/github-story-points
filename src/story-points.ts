interface State {
  closed: number;
  open: number;
}

const state: State = { closed: 0, open: 0 }
let disableObserver = false;

const columns = document.querySelectorAll('.js-project-column');

const accumulatePoint = (link: HTMLLinkElement, point: number) => {
  const previousElement = link.previousElementSibling;
  if (previousElement) {
    const isClosed = previousElement.querySelector('.octicon-issue-closed');

    if (isClosed === null) {
      state.open = state.open + point;
    } else {
      state.closed = state.closed + point;
    }
  }
}

const getPoint = (links: NodeList) => (
  Array.from(links).map((link: any) => {
    const match = link.innerText.match(/\[(\d+)pt\]/);
    if (match) {
      const point = parseInt(match[1]);
      accumulatePoint(link, point);
      return point;
    }
  })
    .filter((n: number | undefined) => typeof n === "number" && Number.isInteger(n))
    .reduce((acc: number, n: number | undefined) => typeof n === "number" ? acc + n : 0, 0) // FIXME can I avoid to use typeof to suppress tsc warnings
);

const showTotalPoint = () => {
  const counter = document.querySelector('.js-column-card-count');
  if (counter) {
    let pointNode = counter.cloneNode(false) as HTMLSpanElement;
    const label = `${state.closed}pt / ${state.open + state.closed}pt`;
    pointNode.innerText = label;
    pointNode.removeAttribute('aria-label');
    const menu = document.querySelector('.js-updatable-content .js-show-project-menu');
    if (menu) {
      menu.insertAdjacentHTML('beforebegin', pointNode.outerHTML);
    }
  }
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
        if (counter) {
          let pointNode = counter.cloneNode(false) as HTMLSpanElement;
          const label = `${point}pt`;
          pointNode.innerText = label;
          pointNode.setAttribute('aria-label', label);
          counter.insertAdjacentHTML('afterend', pointNode.outerHTML);
        }
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