# jsx2qa-cli

A cli tool to transform Rax JSX based project to quickapp.

## Usage as cli tool.

1. Create a miniapp based project using rax-cli.
	```bash
	rax init myApp
	```

2. Install jsx2qa-cli
	```bash
	npm install jsx2qa-cli -g
	```

3. Transform your project.
	```bash
	cd myApp
	jsx2qa start
	```
	The tool will keep watching your source files before being interpreted by `Ctrl + C`.

4. Use `快应用开发工具` to open `dist` directory under your project path.

> You can also use rax-scripts to build quickapp, which intergrate the jsx2qa-cli.

## Integration Testing

As project-based integration testing, the test includes the following cases:

1. import static assets
