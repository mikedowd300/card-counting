class JqService {
  appendElem = (parentElement, childElement) => $(parentElement).append(childElement);

  prependElem = (parentElement, childElement) => $(parentElement).prepend(childElement);

  getElById = id => document.getElementById(id);

  removeChildFromParentByIds = (parentId, childId) => {
    console.log(parentId);
    const parentEl = this.getElById(parentId);
    console.log(parentEl);
    const childEl = this.getElById(childId);
    parentEl.removeChild(childEl);
  };
}