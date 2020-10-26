import React from 'react';
import {Animated, Easing, StyleSheet, StyleProp, ViewStyle} from 'react-native';
// import {ThemeService} from '../../services';
import {PureBaseComponent} from '../../commons';
import {Constants} from '../../helpers';
import View from '../view';
import {Colors, BorderRadiuses, Spacings} from '../../style';


const CONTAINER_HEIGHT = Spacings.s2;
const FULL_WIDTH_CONTAINER_HEIGHT = Spacings.s1;
const TABLET_CONTAINER_HEIGHT = 6;
const TABLET_FULL_WIDTH_CONTAINER_HEIGHT = 10;
const DEFAULT_COLOR = Colors.primary;

/**
 * @description: Progress bar
 * @example:https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/ProgressBarScreen.js
 */
export interface Props {
  /**
   * The progress of the bar from 0 to 100
   */
  progress?: number;
  /**
   *  FullWidth Ui preset
   */
  fullWidth?: boolean;
  /**
   * Override container style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Progress color
   */
  progressColor?: string,
  /**
   * Custom element to render on top of the animated progress
   */
  customElement?: JSX.Element
}

interface State {
  containerWidth: number;
}

export default class ProgressBar extends PureBaseComponent<Props, State> {
  static displayName = 'ProgressBar';

  progressAnimation: Animated.Value;

  constructor(props: Props) {
    super(props);
    this.progressAnimation = new Animated.Value(props.progress);

    this.state = {
      containerWidth: undefined
    };
  }

  static defaultProps: Partial<Props> = {
    progress: 0
  }

  componentDidUpdate(prevProps) {
    const {progress} = this.props;

    if (prevProps.progress !== progress) {
      this.animateProgress(progress);
    }
  }

  getContainerWidth = event => {
    if (!this.state.containerWidth) {
      this.setState({containerWidth: event.nativeEvent.layout.width});
    }
  };

  animateProgress(toValue) {
    Animated.timing(this.progressAnimation, {
      duration: 220,
      easing: Easing.ease,
      toValue,
      useNativeDriver: true
    }).start();
  }

  getAccessibilityProps() {
    const {progress} = this.props;

    return {
      accessible: true,
      accessibilityLabel: `progress bar. ${Math.round(progress)}%`,
      ...this.extractAccessibilityProps()
    };
  }

  getContainerStyle() {
    const {fullWidth} = this.props;
    const containerHeight = fullWidth ? FULL_WIDTH_CONTAINER_HEIGHT : CONTAINER_HEIGHT;
    const tabletContainerHeight = fullWidth ? TABLET_FULL_WIDTH_CONTAINER_HEIGHT : TABLET_CONTAINER_HEIGHT;
    const inlineStyle = fullWidth ? null : styles.inlineContainer;

    return {
      ...inlineStyle,
      height: Constants.isTablet ? tabletContainerHeight : containerHeight
    };
  }

  getProgressStyle() {
    const {fullWidth, progressColor} = this.props;
    // const themeColor = ThemeService.getThemeColor({useCustomTheme: true}, this.context);
    const borderRadius = fullWidth ? styles.fullWidthProgressBorderRadius : styles.inlineBorderRadius;
    const progressStyle = {
      right: this.state.containerWidth,
      backgroundColor: progressColor || DEFAULT_COLOR //animatedStripes ? Colors.getColorTint(themeColor, 50) : Colors.getColorTint(themeColor, 30)
    };

    return {
      ...borderRadius,
      ...progressStyle
    };
  }

  renderCustomElement() {
    const {customElement} = this.props;

    if (customElement) {
      return React.cloneElement(customElement, {
        style: [customElement.props.style, styles.progress]
      });
    }
  }

  render() {
    const {style} = this.props;
    const {containerWidth} = this.state;
    const newProgress = this.progressAnimation.interpolate({inputRange: [0, 100], outputRange: [0, containerWidth]});

    return (
      <View
        onLayout={this.getContainerWidth}
        style={[styles.container, this.getContainerStyle(), style]}
        {...this.getAccessibilityProps()}
      >
        {!!containerWidth && (
          <Animated.View style={[styles.progress, this.getProgressStyle(), {transform: [{translateX: newProgress}]}]}>
            {this.renderCustomElement()}
          </Animated.View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.grey60,
    overflow: 'hidden',
    borderRadius: BorderRadiuses.br100
  },
  inlineContainer: {
    borderRadius: BorderRadiuses.br100
  },
  progress: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  inlineBorderRadius: {
    borderRadius: BorderRadiuses.br100
  },
  fullWidthProgressBorderRadius: {
    borderBottomRightRadius: BorderRadiuses.br100,
    borderTopRightRadius: BorderRadiuses.br100
  }
});
