"""Madlibs Stories."""


class Story:
    """Madlibs story.

    To  make a story, pass a list of prompts, and the text
    of the template.

        >>> s = Story(["noun", "verb"],
        ...     "I love to {verb} a good {noun}.")

    To generate text from a story, pass in a dictionary-like thing
    of {prompt: answer, promp:answer):

        >>> ans = {"verb": "eat", "noun": "mango"}
        >>> s.generate(ans)
        'I love to eat a good mango.'
    """

    def __init__(self, words, text, name):
        """Create story with words and template text."""

        self.name = name
        self.prompts = words
        self.template = text

    def generate(self, answers):
        """Substitute answers into text."""

        text = self.template

        for (key, val) in answers.items():
            print(key)
            text = text.replace("{" + key + "}", val)

        return text


# Here's a story to get you started


story = Story(
    ["place", "noun", "verb", "adjective", "plural_noun"],
    """Once upon a time in a long-ago {place}, there lived a
       large {adjective} {noun}. It loved to {verb} {plural_noun}.""",
       "Basic"
)

prince = Story(
    ["noun", "noun_2", "place", "name", "adjective", "place_2", "place_3", "verb", "verb_2", "verb_3", "verb_4", "place_4", "plural_noun", "place_5", "noun_3", "relative", "adjective", "she_he", "relative_2", "relative_3", "place_5"],
    """Now this is a story all about how my {noun} got flipped turned upside down, and I'd like to take a minute just
    sit right there. I'll tell you how I became the {noun_2} of a {place} called {name}.
    
    In {adjective} {place_2} born and raised. On the {place_3} is where I spent most of my days.
    {verb}ing out, {verb_2}ing, {verb_3}ing all cool and {verb_4}ing some B-Ball outside of the {place_4}. 

    When a couple of {plural_noun}, who were up to no good. Started making trouble in the {place_5}.

    I got in one little {noun_3} and my {relative} got {adjective}. {she_he}} said you're moving with your {relative_2} and {relative_3} in {place_5}.
    """,
       "Prince"
)


examples = [story, prince]