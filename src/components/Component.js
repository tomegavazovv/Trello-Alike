class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
        this.element = null;
        this.childComponents = {};
    }

    render() {
        throw new Error('render method must be implemented');
    }
}
export default Component;