## http-server 使用 https

"start": "http-server ./examples -o -c-1 -S -C ./ssl/server.crt -K ./ssl/server.pem -p 2223"

## docker

`docker run -it -v /Users/elsa/workspace/web-development-season-2:/workspace/web_development_season_2 -p 2223:2223 registry.cn-hangzhou.aliyuncs.com/slideshowp2/ubuntu /bin/zsh`
