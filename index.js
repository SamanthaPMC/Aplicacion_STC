/**
 * @format
 */

import {AppRegistry} from 'react-native';

import {name as appName} from './app.json';
import { productsApp } from './src/productsApp';

AppRegistry.registerComponent(appName, () => productsApp);
