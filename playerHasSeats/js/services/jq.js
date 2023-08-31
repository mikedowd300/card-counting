class JqService {
  appendElem = (parentElement, childElement) => $(parentElement).append(childElement);

  prependElem = (parentElement, childElement) => $(parentElement).prepend(childElement);

  getElById = id => document.getElementById(id);

  removeChildFromParentByIds = (parentId, childId) => {
    const parentEl = this.getElById(parentId);
    const childEl = this.getElById(childId);
    parentEl.removeChild(childEl);
  };
}