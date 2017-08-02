import React from "react";
import {View} from "react-native";
import PropTypes from 'prop-types';
/***
 * View renderer is responsible for creating a container of size provided by LayoutProvider and render content inside it.
 * Also enforces a logic to prevent re renders. RecyclerListView keeps moving these ViewRendereres around using transforms to enable recycling.
 * View renderer will only update if its position, dimensions or given data changes.
 * This is second of the two things recycler works on. Implemented both for web and react native.
 */
class ViewRenderer extends React.Component {
    constructor(args){
        super(args);
        this._dim = {};
        this._onLayout = this._onLayout.bind(this);
    }
    shouldComponentUpdate(newProps) {
        return (this.props.x !== newProps.x ||
        this.props.y !== newProps.y ||
        this.props.width !== newProps.width ||
        this.props.height !== newProps.height ||
        (this.props.dataHasChanged && this.props.dataHasChanged(this.props.data, newProps.data)));
    }

    _onLayout(event) {
        if (this._dim.height !== event.nativeEvent.layout.height || this._dim.width !== event.nativeEvent.layout.width) {
            this._dim.height = event.nativeEvent.layout.height;
            this._dim.width = event.nativeEvent.layout.width;
            if (this.props.onSizeChanged) {
                this.props.onSizeChanged(this._dim, this.props.index);
            }
        }
    }

    render() {
        return (
            <View onLayout = {this._onLayout}
                style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: this.props.width,
                height: this.props.height,
                transform: [{translateX: this.props.x}, {translateY: this.props.y}]
            }}>
                {this.props.childRenderer(this.props.layoutType, this.props.data, this.props.index)}
            </View>
        );
    }
}
export default ViewRenderer;
//#if [DEV]
ViewRenderer.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    childRenderer: PropTypes.func.isRequired,
    layoutType: PropTypes.any,
    dataHasChanged: PropTypes.func,
    onSizeChanged: PropTypes.func,
    data: PropTypes.any,
    index: PropTypes.number
};
//#endif