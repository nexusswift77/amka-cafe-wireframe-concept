
-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (NEW.id, '', '');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to automatically update wallet on transaction
CREATE OR REPLACE FUNCTION public.update_wallet_on_transaction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  wallet_record public.wallets%ROWTYPE;
BEGIN
  -- Get user's wallet
  SELECT * INTO wallet_record FROM public.wallets WHERE user_id = NEW.user_id;
  
  -- Create wallet if it doesn't exist
  IF wallet_record IS NULL THEN
    INSERT INTO public.wallets (user_id, balance, points)
    VALUES (NEW.user_id, 0, 50) -- 50 points welcome bonus
    RETURNING * INTO wallet_record;
  END IF;
  
  -- Update wallet based on transaction type
  IF NEW.type = 'top-up' THEN
    -- Add amount to balance for top-ups
    UPDATE public.wallets 
    SET balance = balance + NEW.amount,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    -- Add bonus points for top-ups (10% of amount in KES)
    IF NEW.points_earned IS NULL THEN
      NEW.points_earned := (NEW.amount / 100) * 10; -- 10% bonus points
    END IF;
    
    UPDATE public.wallets 
    SET points = points + NEW.points_earned,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
  ELSIF NEW.type = 'purchase' THEN
    -- Subtract amount from balance for purchases
    UPDATE public.wallets 
    SET balance = balance - NEW.amount,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    -- Add points for purchases (1 point per 100 KES)
    IF NEW.points_earned IS NULL THEN
      NEW.points_earned := NEW.amount / 10000; -- 1 point per 100 KES
    END IF;
    
    UPDATE public.wallets 
    SET points = points + NEW.points_earned,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
  ELSIF NEW.type = 'points_redemption' THEN
    -- Subtract points that were used
    UPDATE public.wallets 
    SET points = points - NEW.points_used,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update wallet on transaction
CREATE TRIGGER on_transaction_created
  BEFORE INSERT ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_wallet_on_transaction();
