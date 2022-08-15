Excercises for the course https://www.domestika.org/en/courses/2729-creative-coding-making-visuals-with-javascript

## Structure

Separate sketch sources are under the folder [/sketches](sketches) following the naming convention `sketch-XX.js`.

Screenshots, or mp4/gif outputs are available under [/sketches/output/](sketches/output) in the subfolders XX matching the relevant sketch js file.

## Run locally

### Windows 11

Install WSL with your preferred Linux distribution. In this example we are running Ubuntu 22.04 LTS. Make sure that CPU virtualization is enabled before install.

[Install guide](https://techcommunity.microsoft.com/t5/windows-11/how-to-install-the-linux-windows-subsystem-in-windows-11/m-p/2701207)

Once installed, open a WSL console, and follow the Linux guide below.

### Linux
Install the required packages:

```shell
$ sudo apt update && sudo apt install -y nodejs npm
$ # if you want to save video output:
$ # sudo apt install -y ffmpeg
$ npm install canvas-sketch
$ npm install canvas-sketch-util
```

Clone this repository on your local, and navigate in the root directory of the cloned repository.

To run e.g. sketch-02 with live reload in your browser, execute the following command and open the link in the output:
```shell
$ canvas-sketch sketches/sketch-02.js --output=sketches/output/02
[0002] info  Server running at http://172.25.255.249:9966/ (connect)
[0002] info  LiveReload running
[0003] 957ms      365KB (browserify)
[0013] 15ms          0B GET    200 / (generated)
...
```

To save the plotted image, hit `ctrl+s` in your browser while the above command is running, and you will fing the screenshot under the folder specifiedd in the `--output` parameter.
