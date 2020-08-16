// taken from https://gist.github.com/fr-ser/ded7690b245223094cd876069456ed6c
export const debounce = <F extends Function>(func: F, waitMs: number): F => {
  let timeoutID: number;

  // conversion through any necessary as it wont satisfy criteria otherwise
  return <F>(<any>function (this: any, ...args: any[]) {
    clearTimeout(timeoutID);
    const context = this;

    timeoutID = window.setTimeout(function () {
      func.apply(context, args);
    }, waitMs);
  });
};
