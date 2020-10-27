
import {TouchableOpacityProps as RNTouchableOpacityProps} from 'react-native';
import {PureBaseComponent} from '../commons';
import {AlignmentModifiers, FlexModifiers} from '../../src/commons/modifiers';
import {ColorValue} from '../style/colors';

export interface TouchableOpacityThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

export interface TouchableOpacityProps extends RNTouchableOpacityProps {
  backgroundColor?: ColorValue;
  throttleTime?: number;
  throttleOptions?: TouchableOpacityThrottleOptions;
  activeBackgroundColor?: ColorValue;
}

export class TouchableOpacity extends PureBaseComponent<TouchableOpacityProps & AlignmentModifiers & FlexModifiers> {}
