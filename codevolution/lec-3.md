## Chrome's v8 engine

### Javascript engine

- Javascript code we write cannot be understood by the computer
- A Javascript engine is a program that converts Javascript code that developers write to machine code that allows a computer to perform specific tasks.
- Javascript engines are typically developed by browser vendors:
  1. **V8:** Open-Source Javascript engine developed by Google for Chrome
  2. **SpiderMonkey:** The Javascript engine powering Mozilla firefox
  3. **JavascriptCore:** Open-Source Javascript engine developed by Apple for Safari.
  4. **Chakra:** A Javascript engine for original Microsoft Edge(latest version of Edge uses v8)

## Chrome's V8 Engine and NodeJs

- Chrome's V8 engine by Google sits at the core of NodeJs
- By Embedding V8 into your own C++ application, you can write C++ code that gets executed when a user writes Javascript code
- You can add new features to Javascript itself
- Since C++ is great for lower level operations like file handling, database connections and network operation, by embedding v8 into your own C++ program, you have the power to add all of that functionality in Javascript.
- The C++ program we're talking about is NodeJs(although it is more than C++ program)
