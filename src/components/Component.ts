abstract class Component {
    props: any;
    state: any;
    element: HTMLElement | null;
    childComponents: Component[];
    dirty: boolean;
    isMounted: boolean;
    id: string;
    isDirty: boolean;
    dynamicWrapper: HTMLElement | null = null;

    constructor(props = {}) {
        this.props = props;
        this.state = {};
        this.element = null;
        this.childComponents = [];
        this.dirty = false;
        this.isMounted = false;
        this.id = Math.random().toString(36).substring(2, 15);
        this.setState();
    }

    protected abstract render(): HTMLElement;

    renderComponent(): HTMLElement {
        const element = this.render()
        this.isDirty = false;
        this.isMounted = true;
        return element
    }

    componentDidUpdate(): void {
        this.dirty = true;
        this.setState();
    }

    setState(): void {
    }
}

export default Component;