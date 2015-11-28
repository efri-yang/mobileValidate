module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		cssmin: {
			minify:{
				expand:true,
				cwd:"demo/css",
				src:["validate.css"],
				dest:"dist/css",
				ext:".css"
			}
		},
		uglify:{
			 options: {
		        banner: '/*! \n版本:<%= pkg.version %>;\n作者:<%= pkg.author.name %>;\n邮箱:<%= pkg.author.email %>;\n博客地址:<%= pkg.author.blog %>;*/\n'
		      },
			my_target: {
				files:{
		        		'dist/js/mvalidate.js': ['demo/js/mvalidate.js']
		      		}
	      	}
		}, 
		copy:{
			my_target: {
				files:[
					{expand:true,src:["demo/css/validate.css"],dest:"src/css",flatten:true},
					{expand:true,src:["demo/js/mvalidate.js"],dest:"src/js",flatten:true}
				]
			}
		}
	});
	require('load-grunt-tasks')(grunt);
	grunt.registerTask("default",['cssmin:minify',"uglify:my_target","copy:my_target"]);
}