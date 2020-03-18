module DateHelper
  def last_day_of_week(date)
    # Convert the date to a DateTime object if it's a string
    date = Date.parse(date) if date.is_a? String
    
    # Subtract the day of the week from 6 (Saturday) to get the number of days 
    # to add to reach Saturday. Then add that number of days to the given date.
    saturday = date + (6 - date.wday).days
    
    saturday
  end
end