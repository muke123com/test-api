造成这个问题的根源在于data += trunk语句里隐藏的错误，在默认的情况下，trunk是一个Buffer对象。这句话的实质是隐藏了toString的变换的：
