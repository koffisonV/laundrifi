-- Create function to cleanup expired slots
CREATE OR REPLACE FUNCTION cleanup_expired_slots()
RETURNS trigger AS $$
BEGIN
  UPDATE laundry_slots
  SET status = 'completed'
  WHERE expires_at < NOW() AND status = 'active';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run cleanup on any slot changes
CREATE OR REPLACE TRIGGER cleanup_expired_slots_trigger
  AFTER INSERT OR UPDATE ON laundry_slots
  EXECUTE FUNCTION cleanup_expired_slots();

-- Create a function that can be called manually or via Edge Functions if needed
CREATE OR REPLACE FUNCTION manual_cleanup_expired_slots()
RETURNS void AS $$
BEGIN
  UPDATE laundry_slots
  SET status = 'completed'
  WHERE expires_at < NOW() AND status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Grant access to authenticated users
ALTER FUNCTION manual_cleanup_expired_slots() SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION manual_cleanup_expired_slots() TO authenticated;
