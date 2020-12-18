import { debounce } from './utils';

const waitMs = 100;

interface State {
  closed: number;
  open: number;
}

let state: State = { closed: 0, open: 0 };

const columns = () => document.querySelectorAll('.js-project-column');

const accumulatePoint = (card: HTMLLinkElement, point: number) => {
  const isClosed = card.querySelector('.octicon-issue-closed');

  if (isClosed === null) {
    state.open = state.open + point;
  } else {
    state.closed = state.closed + point;
  }
};

const defaultRegex = /\[(\d+(.\d+)?)\s?pt\]/im;
const labelRegEx = /^sp:\s?([\d\.]+)$/im;

const findMatch = (links: HTMLLinkElement[], regex: RegExp) => {
  const matches = Array.from(links)
    .map((link) => link.innerText.match(regex))
    .filter(Boolean);
  return matches.length > 0 ? matches[0] : null;
};

const getPoint = (cards: NodeList) =>
  Array.from(cards)
    .map((card: any) => {
      const titles = card.querySelectorAll('.js-project-card-issue-link') || [];
      const labels = card.querySelectorAll('.IssueLabel') || [];
      const githubCards = card.querySelectorAll('.js-comment-body > p') || [];

      const match =
        findMatch(titles, defaultRegex) ||
        findMatch(labels, labelRegEx) ||
        findMatch(githubCards, defaultRegex);

      if (match) {
        const point = parseFloat(match[1]);
        accumulatePoint(card, point);
        return point;
      }
    })
    .filter((n: number | undefined) => typeof n === 'number')
    .reduce(
      (acc: number, n: number | undefined) =>
        typeof n === 'number' ? acc + n : 0,
      0,
    );

const showTotalPoint = () => {
  const counter = document.querySelector('.js-column-card-count');

  if (counter) {
    const pointNode = document.querySelector(
      '.js-github-story-points-total-counter',
    ) as HTMLSpanElement;
    const label = `${state.closed}pt / ${state.open + state.closed}pt`;

    if (pointNode) {
      pointNode.innerText = label;
    } else {
      let pointNode = counter.cloneNode(false) as HTMLSpanElement;
      pointNode.classList.add('js-github-story-points-total-counter');
      pointNode.innerText = label;
      pointNode.removeAttribute('aria-label');
      const menu = document.querySelector(
        '.js-updatable-content .js-show-project-menu',
      );
      if (menu) {
        menu.insertAdjacentHTML('beforebegin', pointNode.outerHTML);
      }
    }
  }
};

const callback = () => {
  columns().forEach((column) => {
    const cards = column.querySelectorAll(
      '.js-project-column-card:not(.d-none) .js-project-issue-details-container, .js-task-list-container',
    );

    const point = getPoint(cards);

    const pointNode = column.querySelector(
      '.js-github-story-points-counter',
    ) as HTMLSpanElement;
    const label = `${point}pt`;

    if (point === 0 && !pointNode) {
      return;
    } else if (point === 0 && !!pointNode) {
      pointNode.remove();
    } else {
      if (pointNode) {
        pointNode.innerText = label;
      } else {
        const counter = column.querySelector('.js-column-card-count');

        if (counter) {
          let pointNode = counter.cloneNode(false) as HTMLSpanElement;
          pointNode.classList.add('js-github-story-points-counter');
          pointNode.innerText = label;
          pointNode.setAttribute('aria-label', label);
          counter.insertAdjacentHTML('afterend', pointNode.outerHTML);
        }
      }
    }
  });

  showTotalPoint();
  state = { closed: 0, open: 0 };
};

const observer = new MutationObserver(debounce(callback, waitMs));
const targetNode = document.querySelector('.js-project-columns');

const options = {
  attributes: true,
  subtree: true,
};

if (!!targetNode) {
  observer.observe(targetNode, options);
} else {
  throw new Error('.js-project-columns is missing');
}
