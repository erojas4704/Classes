"""Word Finder: finds random words from a dictionary."""

from random import choice

class WordFinder:
    """
        Finds words from a file
       >>> wf = WordFinder("words.txt")

       >>> wf.random()
       >>> wf.random()
       >>> wf.random()
    """
    def __init__(self, source):
        self.words = []
        with open(source) as file:
            for line in file:
                self.words.append(line.strip())
    
    def random(self):
        rand = choice(self.words)
        print(rand)
        return rand

class SpecialWordFinder(WordFinder):
    """
    Awesomer version of the other thing
    >>> swf = SpecialWordFinder("other.txt")
    """
    def __init__(self, source):
        self.words = []
        with open(source) as file:
            for line in file:
                raw = line.strip()
                if len(raw) < 1 or raw[0] == "#":
                    continue
                self.words.append(line.strip())
        
        print(self.words)
