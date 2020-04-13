import { PlaceholderDirective } from './placeholder.directive';
import { ViewContainerRef } from '@angular/core';

describe('PlaceholderDirective', () => {
  it('should create an instance', () => {
    let viewContainerRef: ViewContainerRef;
    const directive = new PlaceholderDirective(viewContainerRef);
    expect(directive).toBeTruthy();
  });
});
