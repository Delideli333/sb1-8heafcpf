import { Application } from '@nativescript/core';
import { AppRootViewModel } from './viewmodels/app-root-view-model';

Application.run({ moduleName: "app-root" });
export const rootVM = new AppRootViewModel();