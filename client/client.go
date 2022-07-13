package client

//Embeds Frontend binary for serving

import "embed"

//go:embed all:dist
var StaticFiles embed.FS
