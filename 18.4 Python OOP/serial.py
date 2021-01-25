"""Python serial number generator."""

class SerialGenerator:
    """Machine to create unique incrementing serial numbers.
    
    >>> serial = SerialGenerator(start=100)

    >>> serial.generate()
    100

    >>> serial.generate()
    101

    >>> serial.generate()
    102

    >>> serial.reset()

    >>> serial.generate()
    100
    """

    def __init__(self, start):
        """
        Create  serial number generator.
        """
        self.current = start
        self.start = start

    def generate(self):
        """
        Generates a new number in the seqeuence
        """
        current = self.current
        self.current += 1
        return current

    def reset(self):
        """
        Resets the thing to the initial value.
        """
        self.current = self.start

    def __repr__(self):
        return f"SerialGenerator start={self.start} next={self.current}"
