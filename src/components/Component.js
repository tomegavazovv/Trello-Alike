class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
        this.element = null;
        this.childComponents = {};
        this.dirty = false;
        this.isMounted = false;
        this.id = Math.random().toString(36).substring(2, 15);
        this.setState();
    }

    _render(){
        throw new Error('render method must be implemented');
    }

    renderComponent(){
        const element = this._render()
        this.isDirty = false;
        this.isMounted = true;
        return element
    }

    componentDidUpdate() {
        this.dirty = true;
        this.setState();
    }

    setState() {}
}

export default Component;