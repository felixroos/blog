# Missing Semester

https://www.youtube.com/watch?v=Z56Jmr9Z34Q

## Shell

### basic commands

- date
- echo
- echo $PATH
- which echo
- pwd
- cd
- ls
- ls ..
- cd ~
- cd - => go to previous directory
- x --help & man x
  - e.g. [FILE]... => multiple files can be passed
  - flag = option that does not take a value e.g. "ls -l"
- ls -l
  - d = directory - = file
  - permissions = three groups me / group / everyone
  - dir read = list
  - write dir = rename create or remove files within dir
    - deleting file needs write permission to directory
  - execute dir = search => allowed to enter
    - to access a file inside a dir, need x on all dirs before (including dir itself)
  - https://www.guru99.com/file-permissions.html
- mv oldpath newpath => can also rename
- cp
- rm, rmdir
- mkdir
- cat = print file contents
- tail = print last n lines of input -n1
- curl => make HTTP request (can do much more)
- tee => take input and write to file AND stdout
- open => open file in appropriate program

### shortcuts

- ctrl+L = clear terminal

### combining programs

- streams: each program has input / output streams (simplified)
  - cat x.txt > y.txt (copy without cp)
  - "|" take output of left to input of right

### root user

special user that can do whatever it wants (superuser)

- sudo => do the following as superuser
- sudo su => open shell as superuser